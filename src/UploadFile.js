import React, { Component } from 'react'
import { Container, Button, Message, Form } from 'semantic-ui-react'
import ResultsList from "./ResultsList";
import GroupResultList from "./GroupResultList";

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            file: null,
            is_view_groups_list: false,
            is_view_people_list: false,
            view: null
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

    toggleView(view) {
        if (view === "people") {
            this.setState({is_view_people_list: true});
        }
        if (view === "groups") {
            this.setState({is_view_groups_list: true});
        }
    }

    render() {
        let message = this.state.file === null ? "Choose File to Upload" : this.state.file.name;
        let resultlist = null;

        if (typeof this.state.data.result !== 'undefined' && this.state.data.is_person_file) {
            resultlist = <ResultsList responseResults={this.state.data.result}/>;
        } else if (typeof this.state.data.result !== 'undefined' && this.state.data.is_group_file) {
            resultlist = <GroupResultList responseResults={this.state.data.result}/>
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
                    <Button onClick={() => this.toggleView("groups")}>View Groups</Button>
                    <Button onClick={() => this.toggleView("people")}>View People</Button>
                </Form>
                {resultlist}
                {(this.state.is_view_groups_list) ? <GroupResultList needData={true}/> : ''}
                {(this.state.is_view_people_list) ? <ResultsList needData={true}/> : ''}
            </Container>
        );
    }
}
export default UploadFile
