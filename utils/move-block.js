async function moveBlocks(number) {
  console.log("Moving blocks.....");
  for (let index = 0; index < number; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
}

module.exports = { moveBlocks };
