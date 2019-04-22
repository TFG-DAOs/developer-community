/* global artifacts contract before beforeEach it assert */
const { assertRevert } = require('@aragon/test-helpers/assertThrow')

const ProfileManager = artifacts.require('ProfileManager.sol')
const DAOFactory = artifacts.require(
  '@aragon/core/contracts/factory/DAOFactory'
)
const EVMScriptRegistryFactory = artifacts.require(
  '@aragon/core/contracts/factory/EVMScriptRegistryFactory'
)
const ACL = artifacts.require('@aragon/core/contracts/acl/ACL')
const Kernel = artifacts.require('@aragon/core/contracts/kernel/Kernel')

const getContract = name => artifacts.require(name)

const ANY_ADDR = '0xffffffffffffffffffffffffffffffffffffffff'

const checkEvent = (receipt, eventName, expectedArgs) => {
  const events = receipt.logs.filter(x => x.event === eventName)
  assert.equal(events.length, 1, `should have emitted ${eventName} event`)
  assert.deepEqual(events[0].args, expectedArgs)
}

contract('ProfileManager', accounts => {
  let APP_MANAGER_ROLE, INCREMENT_ROLE, DECREMENT_ROLE
  let daoFact, appBase, app

  const root = accounts[0]
  const holder = accounts[1]

  before(async () => {
    const kernelBase = await getContract('Kernel').new(true) // petrify immediately
    const aclBase = await getContract('ACL').new()
    const regFact = await EVMScriptRegistryFactory.new()
    daoFact = await DAOFactory.new(
      kernelBase.address,
      aclBase.address,
      regFact.address
    )
    appBase = await ProfileManager.new()

    // Setup constants
    APP_MANAGER_ROLE = await kernelBase.APP_MANAGER_ROLE()
  })

  beforeEach(async () => {
    const r = await daoFact.newDAO(root)
    const dao = Kernel.at(
      r.logs.filter(l => l.event === 'DeployDAO')[0].args.dao
    )
    const acl = ACL.at(await dao.acl())

    await acl.createPermission(root, dao.address, APP_MANAGER_ROLE, root, {
      from: root,
    })

    const receipt = await dao.newAppInstance(
      '0x1234',
      appBase.address,
      '0x',
      false,
      { from: root }
    )
    app = ProfileManager.at(
      receipt.logs.filter(l => l.event === 'NewAppProxy')[0].args.proxy
    )

  })

  it('should be add a Profile', async () => {
    app.initialize()
    const sup = web3.fromUtf8("Support")
    const receipt = await app.addProfile(sup)
    assert.equal(await (app.profiles(sup)), true)

    checkEvent(receipt,"AddProfile",{
      entity: root,
      profile: sup + '0'.repeat(50)
    })
  })

  it('should be exists a default "Anonimo" profile', async () => {
    app.initialize()
    const defaultProfile = web3.fromUtf8("Anonimo")
    assert.equal(await (app.profiles(defaultProfile)), true)
  })
})
