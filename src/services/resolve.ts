import { useExecutionDbClient } from "../utils";

export const resolveOrderService = async () => {
  const response = await useExecutionDbClient.getOpenExecutions();
  if (response.status != 200) {
    return response;
  }
  // loop over executions in response and make 1inch call

  return {
    status: 200,
    data: "Resolved orders.",
  };
};
