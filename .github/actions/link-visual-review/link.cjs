const marker = "<!-- github-visual-review"
const pattern = /^visual-review-[0-9a-f]{64}\.html$/

module.exports = async function linkReview(github, context, base) {
  const { workflow_run: run } = context.payload
  if (run?.event !== "pull_request" || !run.head_repository || run.conclusion === "cancelled") {
    return
  }

  const { repo } = context
  const pulls = await github.paginate(github.rest.pulls.list, {
    ...repo,
    base,
    head: `${run.head_repository.owner.login}:${run.head_branch}`,
    state: "open",
  })
  const pull = pulls.find(
    ({ head }) => head.sha === run.head_sha && head.repo?.id === run.head_repository.id
  )
  if (!pull) return

  const artifacts = await github.paginate(github.rest.actions.listWorkflowRunArtifacts, {
    ...repo,
    run_id: run.id,
  })
  const artifact = artifacts
    .filter(
      ({ created_at, expired, name }) =>
        !expired && pattern.test(name) && created_at >= run.run_started_at
    )
    .sort((left, right) => right.id - left.id)[0]

  const issue = { ...repo, issue_number: pull.number }
  const comments = await github.paginate(github.rest.issues.listComments, issue)
  const comment = comments.find(
    ({ body, user }) => user?.login === "github-actions[bot]" && body?.startsWith(marker + " ")
  )
  const [, lastRun, lastAttempt] =
    comment?.body?.match(/^<!-- github-visual-review (\d+) (\d+) -->/) ?? []
  if (
    Number(lastRun) > run.id ||
    (Number(lastRun) === run.id && Number(lastAttempt) > run.run_attempt)
  ) {
    return
  }
  if (!artifact && !comment) return

  // A branch can advance while the artifact and comment lists are being read.
  const { data: current } = await github.rest.pulls.get({ ...repo, pull_number: pull.number })
  if (current.state !== "open" || current.head.sha !== run.head_sha) return

  const runUrl = `${context.serverUrl}/${repo.owner}/${repo.repo}/actions/runs/${run.id}`
  const link = artifact
    ? `[Open interactive visual review](${runUrl}/artifacts/${artifact.id})`
    : `This revision has no visual review report. [Workflow run](${runUrl})`
  const body = `${marker} ${run.id} ${run.run_attempt} -->\n\n### Visual review\n\n${link}`
  if (comment) {
    if (comment.body !== body) {
      await github.rest.issues.updateComment({ ...repo, comment_id: comment.id, body })
    }
  } else {
    await github.rest.issues.createComment({ ...issue, body })
  }
}
