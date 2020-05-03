import React from 'react';
import {Alert, AlertTitle} from "@material-ui/lab";

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
          hasError: false ,
          error:null
        };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log(error, errorInfo);
      this.setState({hasError:true,error:error.toString()});
    }
  
    render() 
    {
        const {hasError,error,errorInfo} =this.state;
        if (hasError) 
        {
            return (
                <Alert severity="error">
                    <AlertTitle>
                    An Unexpected error has occured.Please refresh page.
                    </AlertTitle>
                    {error}
                </Alert>
            );
        }
      return this.props.children; 
    }
  }
  export default ErrorBoundary;