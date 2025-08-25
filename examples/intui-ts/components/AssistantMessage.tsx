import { AssistantMessageProps } from "@copilotkit/react-ui";

export const CustomAssistantMessage = (props: AssistantMessageProps) => {
  const { message, isLoading, subComponent } = props;

  return (
    <div className="pb-4">
      {(message || isLoading) && 
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {message && <div dangerouslySetInnerHTML={{ __html: message }} />}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-blue-500">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <span>Thinking...</span>
              </div>
            )}
          </div>
        </div>
      }
      
      {subComponent && <div className="mt-2">{subComponent}</div>}
    </div>
  );
};
