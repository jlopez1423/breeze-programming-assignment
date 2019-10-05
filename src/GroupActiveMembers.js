import React, {Component} from 'react'
import {Table, Container} from "semantic-ui-react";

class GroupActiveMembers extends Component {
    render() {
        return (
            <Container style={{ paddingTop: 20 }}>
                {
                    this.props.responseData.map((group, index) => {
                        return (
                            <Table cell padded>
                                <Table.Header>
                                    <Table.Row key={index}>
                                        <Table.HeaderCell singleLine
                                                          colSpan='4'>{group.group_name}</Table.HeaderCell>
                                    </Table.Row>

                                    <Table.Row>
                                        <Table.HeaderCell>First Name</Table.HeaderCell>
                                        <Table.HeaderCell>Last Name</Table.HeaderCell>
                                        <Table.HeaderCell>Email</Table.HeaderCell>
                                        <Table.HeaderCell>Status</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                {
                                    group.persons.map((person, ind) => {
                                        return (
                                            <Table.Body>
                                                <Table.Row key={ind}>
                                                    <Table.Cell singleLine>{person.first_name}</Table.Cell>
                                                    <Table.Cell singleLine>{person.last_name}</Table.Cell>
                                                    <Table.Cell singleLine>{person.email_address}</Table.Cell>
                                                    <Table.Cell singleLine>{person.status}</Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        )
                                    })
                                }
                            </Table>
                        );
                    })
                }
            </Container>

        );
    }
}

export default GroupActiveMembers;
