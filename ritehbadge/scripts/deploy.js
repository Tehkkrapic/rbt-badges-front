async function main() {
    const RitehBadge = await ethers.getContractFactory("RitehBadge")
  
    // Start deployment, returning a promise that resolves to a contract object
    const ritehBadge = await RitehBadge.deploy()
    await ritehBadge.deployed()
    console.log("Contract deployed to address:", ritehBadge.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })