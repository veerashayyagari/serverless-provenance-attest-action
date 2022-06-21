import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'

async function run(): Promise<void> {
  try {
    const outputPath: string = core.getInput('publish-output-path')
    core.debug(`Received output path ${outputPath} ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    const repo: string = process.env.GITHUB_REPOSITORY ?? 'Unknown'
    const owner: string = process.env.GITHUB_REPOSITORY_OWNER ?? 'Unknown'
    const actor: string = process.env.GITHUB_ACTOR ?? 'Unknown'
    const runId: string = process.env.GITHUB_RUN_ID ?? 'Unknown'
    const branchName: string = process.env.GITHUB_REF_NAME ?? 'Unknown'
    const absolutePath: string = path.resolve(outputPath, '.attest.json')

    const attestationObject = {
      repo,
      owner,
      actor,
      runId,
      branchName,
      absolutePath
    }

    core.debug(`Absolute Path : ${absolutePath}`)
    //core.debug(`Process.env : ${JSON.stringify(process.env)}`)

    fs.writeFile(
      `${absolutePath}`,
      JSON.stringify(attestationObject),
      {flag: 'a+'},
      err => {
        if (err) {
          core.setFailed(`${err?.message}, creating file`)
        }
      }
    )
    core.debug(new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
