import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPageReactRouter = () => {
  const error = useRouteError();

  const getErrorResponse = () => {
    if (isRouteErrorResponse(error)) {
      return (
        <i>
          {`${error.status}  ${error.statusText}`}
        </i>
      )
    }
    return (
      <i>Houve um erro inexperado, por favor tente novamente mais tarde!</i>
    );
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {getErrorResponse()}                
    </p>
    </div >
  );
}

export default ErrorPageReactRouter;