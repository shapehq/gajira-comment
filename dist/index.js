require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 794:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Jira = __nccwpck_require__(343)
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
      console.log('No issue IDs provided. Exiting without adding comments.')
      return {}
    }

    const issueList = issueIds.split(",").filter(issueId => issueId.trim() !== '') // Filter out empty strings

    // Additional check for empty issueList after filtering
    if (issueList.length === 0) {
      console.log('No valid issue IDs provided after filtering. Exiting without adding comments.')
      return {}
    }

    console.log(`Adding comment to ${issueList.length} issues: \n${comment}`)

    for (const issueId of issueList) {
      console.log(`Adding comment to ${issueId}`)
      try {
        await this.Jira.addComment(issueId, { body: comment })
      } catch (error) {
        console.error(`Failed to add comment to ${issueId}:`, error.message)
      }
    }

    return {}
  }
}


/***/ }),

/***/ 343:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { get } = __nccwpck_require__(903)

const serviceName = 'jira'
const { format } = __nccwpck_require__(310)
const client = __nccwpck_require__(751)(serviceName)

class Jira {
  constructor ({ baseUrl, token, email }) {
    this.baseUrl = baseUrl
    this.token = token
    this.email = email
  }

  async addComment (issueId, data) {
    return this.fetch('addComment', {
      pathname: `/rest/api/2/issue/${issueId}/comment`,
    }, {
      method: 'POST',
      body: data,
    })
  }

  async createIssue (body) {
    return this.fetch('createIssue',
      { pathname: '/rest/api/2/issue' },
      { method: 'POST', body })
  }

  async getIssue (issueId, query = {}) {
    const { fields = [], expand = [] } = query

    try {
      return this.fetch('getIssue', {
        pathname: `/rest/api/2/issue/${issueId}`,
        query: {
          fields: fields.join(','),
          expand: expand.join(','),
        },
      })
    } catch (error) {
      if (get(error, 'res.status') === 404) {
        return
      }

      throw error
    }
  }

  async getIssueTransitions (issueId) {
    return this.fetch('getIssueTransitions', {
      pathname: `/rest/api/2/issue/${issueId}/transitions`,
    }, {
      method: 'GET',
    })
  }

  async transitionIssue (issueId, data) {
    return this.fetch('transitionIssue', {
      pathname: `/rest/api/3/issue/${issueId}/transitions`,
    }, {
      method: 'POST',
      body: data,
    })
  }

  async fetch (apiMethodName,
    { host, pathname, query },
    { method, body, headers = {} } = {}) {
    const url = format({
      host: host || this.baseUrl,
      pathname,
      query,
    })

    if (!method) {
      method = 'GET'
    }

    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = 'application/json'
    }

    if (headers.Authorization === undefined) {
      headers.Authorization = `Basic ${Buffer.from(`${this.email}:${this.token}`).toString('base64')}`
    }

    // strong check for undefined
    // cause body variable can be 'false' boolean value
    if (body && headers['Content-Type'] === 'application/json') {
      body = JSON.stringify(body)
    }

    const state = {
      req: {
        method,
        headers,
        body,
        url,
      },
    }

    try {
      await client(state, `${serviceName}:${apiMethodName}`)
    } catch (error) {
      const fields = {
        originError: error,
        source: 'jira',
      }

      delete state.req.headers

      throw Object.assign(
        new Error('Jira API error'),
        state,
        fields
      )
    }

    return state.res.body
  }
}

module.exports = Jira


/***/ }),

/***/ 751:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const fetch = __nccwpck_require__(937)

module.exports = serviceName => async (state, apiMethod = 'unknown') => {

	const response = await fetch(state.req.url, state.req)

	state.res = {
		headers: response.headers?.raw(),
		status: response.status,
	}

	// const tags = {
	//   api_method: apiMethod,
	//   method: state.req.method || 'GET',
	//   response_code: response.status,
	//   service: serviceName,
	// }

	state.res.body = await response.text()

	const isJSON = (response.headers.get('content-type') || '').includes('application/json')

	if (isJSON && state.res.body) {
		state.res.body = JSON.parse(state.res.body)
	}

	if (!response.ok) {
		throw new Error(response.statusText)
	}

	return state
}


/***/ }),

/***/ 782:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 903:
/***/ ((module) => {

module.exports = eval("require")("lodash");


/***/ }),

/***/ 937:
/***/ ((module) => {

module.exports = eval("require")("node-fetch");


/***/ }),

/***/ 443:
/***/ ((module) => {

module.exports = eval("require")("yaml");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const fs = __nccwpck_require__(147)
const YAML = __nccwpck_require__(443)
const core = __nccwpck_require__(782)

const cliConfigPath = `${process.env.HOME}/.jira.d/config.yml`
const configPath = `${process.env.HOME}/jira/config.yml`
const Action = __nccwpck_require__(794)

// eslint-disable-next-line import/no-dynamic-require
const githubEvent = require(process.env.GITHUB_EVENT_PATH)
const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

async function exec () {
  try {
    const result = await new Action({
      githubEvent,
      argv: parseArgs(),
      config,
    }).execute()

    if (result) {
      const extendedConfig = Object.assign({}, config, result)

      fs.writeFileSync(configPath, YAML.stringify(extendedConfig))

      return
    }

    console.log('Failed to comment issues.')
    process.exit(78)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

function parseArgs () {
  return {
    issues: core.getInput('issues'),
    comment: core.getInput('comment')
  }
}

exec()

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map