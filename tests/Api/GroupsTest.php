<?php


namespace Tests\Api;

use Tests\TestCase;
use App\Models\Group;
use Illuminate\Foundation\Testing\WithFaker;

class GroupsTest extends TestCase
{
    use WithFaker;

    public function testGroupPersonCreated()
    {
        $expected = [
            'group_name' => 'The Good Group',
        ];
        $response = $this->json('POST', '/api/group', $expected);

        $response
            ->assertStatus(201)
            ->assertJsonFragment($expected);
    }

    public function testGroupRetrieved()
    {
        $group = factory('App\Models\Group')->create();

        $response = $this->json('GET', '/api/group/' . $group->id);
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'group_name',
                ],
            ]);
    }

    public function testAllGroupRetrieved()
    {
        $group = factory('App\Models\Group', 25)->create();

        $response = $this->json('GET', '/api/group');
        $response
            ->assertStatus(200)
            ->assertJsonCount(25, 'data');
    }

    public function testNoGroupRetrieved()
    {
        $group = factory('App\Models\Group')->create();
        Group::destroy($group->id);

        $response = $this->json('GET', '/api/group/' . $group->id);
        $response->assertStatus(404);
    }

    public function testGroupUpdated()
    {
        $group = factory('App\Models\Group')->create();

        $updatedGroupName = $this->faker->name();
        $response = $this->json('PUT', '/api/group/' . $group->id, [
            'group_name' => $updatedGroupName
        ]);
        $response->assertStatus(204);

        $updatedGroup = Group::find($group->id);
        $this->assertEquals($updatedGroupName, $updatedGroup->group_name);
    }

    public function testGroupDeleted()
    {
        $group = factory('App\Models\Group')->create();

        $deleteResponse = $this->json('DELETE', '/api/group/' . $group->id);
        $deleteResponse->assertStatus(204);

        $response = $this->json('GET', '/api/group/' . $group->id);
        $response->assertStatus(404);

    }
}
