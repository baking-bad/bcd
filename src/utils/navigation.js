export function shareContract(contract) {
  if (navigator.share) {
    navigator.share({
      url: `https://better-call.dev/${contract.network}/${contract.address}`,
      text: `Check out the contract: ${contract.alias || contract.address}`,
      title: `${contract.alias || contract.address}`,
    });
  }
}