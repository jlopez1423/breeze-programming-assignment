import React, {Component} from 'react'
import {Table} from 'semantic-ui-react'

class GroupResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        if(this.props.needData) {
            fetch("http://localhost:8000/api/group")
                .then(response => response.json())
                .then(data => this.setState({ data: data.data }));
        }
    }

    render() {
        let data = typeof this.props.responseResults !== 'undefined' ? this.props.responseResults : this.state.data;

        return (
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
            </Table>
        );
    }

}

export default GroupResultList
