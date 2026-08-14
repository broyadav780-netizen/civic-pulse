import seedIssues from '../mock/issues.json'
const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms))
let issues = [...seedIssues]

// Replace only these methods with fetch calls after the backend contract is agreed.
export const issuesApi = {
  async list() { await delay(); return [...issues] },
  async getById(id) { await delay(); const issue = issues.find(item => item.id === id); if (!issue) throw new Error('Report not found'); return issue },
  async create(payload) {
    await delay(600)
    const issue = { id: `CP-${1043 + issues.length}`, status: 'Reported', priority: 'Medium', createdAt: 'Just now', similarReports: 0, timeline: [['Reported', 'Just now']], ...payload }
    issues = [issue, ...issues]
    return issue
  }
}
