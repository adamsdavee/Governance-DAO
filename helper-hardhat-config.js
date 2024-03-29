const MIN_DELAY = 3600;
const VOTING_DELAY = 1;
const VOTING_PERIOD = 5;
const QUORUM_PERCENTAGE = 4; // Minimum percentage of token holders that must vote
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const NEW_STORE_VALUE = 77;
const FUNC = "store";
const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the Box";
const proposalsFile = "proposals.json";

module.exports = {
  MIN_DELAY,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  ADDRESS_ZERO,
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  proposalsFile,
};
