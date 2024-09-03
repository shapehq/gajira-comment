const Jira = require('./common/net/Jira')
module.exports = class {
  constructor ({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute () {
    const issueIds = this.argv.issues || this.config.issues || null
    const { comment } = this.argv

    // Error handling for empty or null issueIds
    if (!issueIds) {
      console.log('::warning::No issue IDs provided. Exiting without adding comments.')
      return {}
    }

    const issueList = issueIds.split(",").filter(issueId => issueId.trim() !== '') // Filter out empty strings

    // Additional check for empty issueList after filtering
    if (issueList.length === 0) {
      console.log('::warning::No valid issue IDs provided after filtering. Exiting without adding comments.')
      return {}
    }

    console.log(`Adding comment to ${issueList.length} issues: \n${comment}`)

    for (const issueId of issueList) {
      console.log(`Adding comment to ${issueId}`)
      try {
        await this.Jira.addComment(issueId, { body: comment })
      } catch (error) {
        console.error(`::warning::Failed to add comment to ${issueId}:`, error.message)
      }
    }

    return {}
  }
}
