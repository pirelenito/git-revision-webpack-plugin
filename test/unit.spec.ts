import { Compiler } from 'webpack'
import { GitRevisionPlugin } from '../src'

jest.mock('../src/build-file', () => jest.fn())
// eslint-disable-next-line import/first
import buildFile from '../src/build-file'
const buildFileMock = buildFile as jest.Mock

jest.mock('../src/helpers/run-git-command', () => jest.fn())
// eslint-disable-next-line import/first
import runGitCommand from '../src/helpers/run-git-command'
const runGitCommandMock = runGitCommand as jest.Mock

const compiler = ({} as unknown) as Compiler

beforeEach(() => {
  buildFileMock.mockClear()
  runGitCommandMock.mockClear()
})

describe('on setting custom commithash command', function() {
  it('should run the build on .apply', function() {
    new GitRevisionPlugin({
      commithashCommand: 'custom commithash command',
    }).apply(compiler)

    var commithashCall = buildFileMock.mock.calls.find(function(calls) {
      return calls[0].asset === 'COMMITHASH'
    })

    expect(commithashCall[0].command).toEqual('custom commithash command')
  })

  it('should run the custom git command on .commithash', function() {
    new GitRevisionPlugin({
      commithashCommand: 'custom commithash command',
    }).commithash()

    expect(runGitCommandMock).toHaveBeenCalledWith(undefined, 'custom commithash command')
  })
})

describe('on setting custom version command', function() {
  it('should prevent setting lightweightTags flag', function() {
    expect(function() {
      /* eslint no-new: 0 */
      new GitRevisionPlugin({
        versionCommand: 'custom version command',
        lightweightTags: true,
      })
    }).toThrow("lightweightTags can't be used together versionCommand")
  })

  it('should run the build on .apply', function() {
    new GitRevisionPlugin({
      versionCommand: 'custom version command',
    }).apply(compiler)

    var call = buildFileMock.mock.calls.find(function(calls) {
      return calls[0].asset === 'VERSION'
    })

    expect(call[0].command).toEqual('custom version command')
  })

  it('should run the custom git command on .version', function() {
    new GitRevisionPlugin({
      versionCommand: 'custom version command',
    }).version()

    expect(runGitCommandMock).toHaveBeenCalledWith(undefined, 'custom version command')
  })
})

describe('on setting custom branch command', function() {
  it('should run the build on .apply', function() {
    new GitRevisionPlugin({
      branch: true,
      branchCommand: 'custom branch command',
    }).apply(compiler)

    var branchCall = buildFileMock.mock.calls.find(function(calls) {
      return calls[0].asset === 'BRANCH'
    })

    expect(branchCall[0].command).toEqual('custom branch command')
  })

  it('should run the custom git command on .version', function() {
    new GitRevisionPlugin({
      branch: true,
      branchCommand: 'custom branch command',
    }).branch()

    expect(runGitCommandMock).toHaveBeenCalledWith(undefined, 'custom branch command')
  })
})

describe('on setting custom last commit date time command', function() {
  it('should run the build on .apply', function() {
    new GitRevisionPlugin({
      lastCommitDateTimeCommand: 'custom last commit date time command',
    }).apply(compiler)

    var lastCommitDateTimeCall = buildFileMock.mock.calls.find(function(calls) {
      return calls[0].asset === 'LASTCOMMITDATETIME'
    })

    expect(lastCommitDateTimeCall[0].command).toEqual('custom last commit date time command')
  })

  it('should run the custom git command on .lastcommitdatetime', function() {
    new GitRevisionPlugin({
      lastCommitDateTimeCommand: 'custom last commit date time command',
    }).lastcommitdatetime()

    expect(runGitCommand).toHaveBeenCalledWith(undefined, 'custom last commit date time command')
  })
})
