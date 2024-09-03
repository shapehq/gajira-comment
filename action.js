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

    console.log(`!${issueIds}!`);

    const issueList = issueIds.split(",");

    console.log(`Adding comment to ${issueList.length} issues: \n${comment}`)

    for (const issueId of issueList) {
      console.log(`Adding comment to ${issueId}`)
      await this.Jira.addComment(issueId, { body: comment })
    }

    return {}
  }
}
