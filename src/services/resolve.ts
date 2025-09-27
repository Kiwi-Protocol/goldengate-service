import { useExecutionDbClient } from "../utils";

export const resolveOrderService = async () => {
  const response = await useExecutionDbClient.getOpenExecutions();
  if (response.status != 200) {
    return response;
  }
  const numExecToExecute = response.data.length;
  for (let idx = 0; idx < numExecToExecute; idx++) {
    const execution = response.data[idx];
    // TODO: send execution to 1inch API
  }
  return {
    status: 200,
    data: "Resolved orders.",
  };
};
