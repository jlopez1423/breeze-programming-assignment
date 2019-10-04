import React, { Component } from 'react'
import { Container, Button, Message, Form } from 'semantic-ui-react'
import ResultsList from "./ResultsList";

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            file: null
        };
    }

    fileInputRef = React.createRef();

    fileChange(e) {
        this.setState({ file: e.target.files[0] });
    };

    onFormSubmit(e) {
        e.preventDefault(); // Stop form submit

        if(this.state.file !== null) {
            this.fileUpload(this.state.file);
        }

    };

    fileUpload(file) {

        let reader = new FileReader();
        let self = this;
        reader.readAsText(this.state.file);

        reader.onload= function(event) {
            fetch("http://localhost:8000/api/csv/upload",{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    csv_file: reader.result,
                })
            })
                .then(response => response.json())
                .then(data => self.setState({ data: data }));
        };
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.data.length > 0) {
            console.log("we do make it here");
            console.log(nextState);

            return <ResultsList/>;
        }
    }


    render() {
        let message = this.state.file === null ? "Choose File to Upload" : this.state.file.name;
        let resultlist = null;

        if(this.state.data.length > 0) {
            resultlist = <ResultsList responseResults={this.state.data}/>;
        }

        return (
            <Container>
                <Message>{message}</Message>
                <Form onSubmit={ e => this.onFormSubmit(e)}>
                    <Form.Field>
                        <Button
                            content="Choose File"
                            labelPosition="left"
                            icon="file"
                            onClick={() => this.fileInputRef.current.click()}
                        />
                        <input
                            ref={this.fileInputRef}
                            type="file"
                            hidden
                            onChange={this.fileChange.bind(this)}
                        />
                    </Form.Field>
                    <Button type="submit">Upload</Button>
                </Form>
                {resultlist}
            </Container>
        );
    }
}
export default UploadFile
