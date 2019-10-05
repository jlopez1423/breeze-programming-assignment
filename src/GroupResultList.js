import React, {Component} from 'react'
import {Table, Container} from 'semantic-ui-react'
import GroupActiveMembers from './GroupActiveMembers';

class GroupResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {data: [], resultView: ''};
    }

    componentDidMount() {
        let self = this;

        if(this.props.needData) {
            fetch("http://localhost:8000/api/group")
                .then(response => response.json())
                .then(function(data) {
                    self.setState({ data: data.data });
                    self.setUpResultView();
                });
        }
    }

    setUpResultView() {
       this.state.resultView = <GroupActiveMembers responseData={this.state.data}/>;
    }

    render() {
        let data = typeof this.props.responseResults !== 'undefined' ? this.props.responseResults : this.state.data;

        return (
            <Container>
                { typeof this.props.needData === 'undefined' ?
                    <Table celled padded>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell singleLine>Group Name</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                            <Table.Body>
                                {
                                    data.map((group, index) => {
                                        return (
                                            <Table.Row key={index}>
                                                 <Table.Cell singleLine>{group.group_name}</Table.Cell>
                                            </Table.Row>
                                        );
                                    })
                                }
                            </Table.Body>
                    </Table> : ''
                }
                {this.props.needData ? this.state.resultView : ''}
            </Container>
        );
    }

}

export default GroupResultList
