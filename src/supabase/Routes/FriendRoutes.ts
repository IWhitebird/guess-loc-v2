import supabase from '../init'

// main fetch routes
export const getFriends = async (id: any) => {
    const { data, error } = await supabase
        .from('users')
        .select('friends_id')
        .eq('id', id)
        .single()

    let friendsList: any = []

    if (data?.friends_id && data?.friends_id.length > 0) {
        for (let i = 0; i < data?.friends_id.length; i++) {
            const { data: friendData, error: friendError } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.friends_id[i])
                .single()
            if (friendError) throw friendError
            friendsList.push(friendData)
        }
    }

    if (error) throw error
    return friendsList
}

export const getIncomingFriendRequests = async (id: any) => {
    const { data, error } = await supabase
        .from('users')
        .select('incoming_fr_reqs')
        .eq('id', id)
        .single()

    let incomingRequests: any = []

    if (data?.incoming_fr_reqs && data?.incoming_fr_reqs.length > 0) {
        for (let i = 0; i < data?.incoming_fr_reqs.length; i++) {
            const { data: friendData, error: friendError } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.incoming_fr_reqs[i])
                .single()
            if (friendError) throw friendError
            incomingRequests.push(friendData)
        }
    }

    if (error) throw error
    return incomingRequests
}

//===========================================================================================
// post routes
//send friend request
export const sendFriendRequest = async (id: any, friend_id: any) => {

    // Update current user's outgoing friend requests

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('outgoing_fr_reqs')
        .eq('id', id);

    if (userError) throw userError;

    const currentOutgoing = userData[0].outgoing_fr_reqs || [];

    if (currentOutgoing.includes(friend_id)) {
        console.log('Friend request already sent');
        return;
    }

    const { error: sendError } = await supabase
        .from('users')
        .update({
            outgoing_fr_reqs: [...currentOutgoing, friend_id],
        })
        .eq('id', id);

    if (sendError) throw sendError;

    // Update friend's incoming friend requests

    const { data: friendData, error: friendError } = await supabase
        .from('users')
        .select('incoming_fr_reqs')
        .eq('id', friend_id);

    if (friendError) throw friendError;

    const currentIncoming = friendData[0].incoming_fr_reqs || [];

    if (currentIncoming.includes(id)) {
        console.log('Friend request already sent');
        return;
    }

    const { error: updateFriendError } = await supabase
        .from('users')
        .update({
            incoming_fr_reqs: [...currentIncoming, id],
        })
        .eq('id', friend_id);

    if (updateFriendError) throw updateFriendError;
}

//accept friend request
export const acceptFriendRequest = async (id: any, friend_id: any) => {

    // Update current user's friends list
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    let currentFriends = data.friends_id || [];
    let currentIncoming = data.incoming_fr_reqs || [];

    if (!currentIncoming.includes(friend_id)) {
        console.log('Friend request does not exist');
        return;
    }

    currentFriends.push(friend_id);

    const { error: acceptError } = await supabase
        .from('users')
        .update({
            friends_id: currentFriends,
            incoming_fr_reqs: currentIncoming.filter((friend: any) => friend !== friend_id),
        })
        .eq('id', id);

    if (acceptError) throw acceptError;

    // Update friend' friends list
    const { data: friendData, error: friendError } = await supabase
        .from('users')
        .select('*')
        .eq('id', friend_id)
        .single();

    if (friendError) throw friendError;

    let currentFriendFriends = friendData.friends_id || [];
    let currentFriendOutgoing = friendData.outgoing_fr_reqs || [];

    if (!currentFriendOutgoing.includes(id)) {
        console.log('Friend request does not exist');
        return;
    }

    currentFriendFriends.push(id);

    const { error: updateFriendError } = await supabase
        .from('users')
        .update({
            friends_id: currentFriendFriends,
            outgoing_fr_reqs: currentFriendOutgoing.filter((friend: any) => friend !== id),
        })
        .eq('id', friend_id);

    if (updateFriendError) throw updateFriendError;
}

//reject friend request
export const rejectFriendRequest = async (id: any, friend_id: any) => {

    // Update current user's incoming friend requests
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    let currentIncoming = data.incoming_fr_reqs || [];

    if (!currentIncoming.includes(friend_id)) {
        console.log('Friend request does not exist');
        return;
    }

    const { error: rejectError } = await supabase
        .from('users')
        .update({
            incoming_fr_reqs: currentIncoming.filter((friend: any) => friend !== friend_id),
        })
        .eq('id', id);

    if (rejectError) throw rejectError;

    // Update friend's outgoing friend requests
    const { data: friendData, error: friendError } = await supabase
        .from('users')
        .select('*')
        .eq('id', friend_id)
        .single();

    if (friendError) throw friendError;

    let currentFriendOutgoing = friendData.outgoing_fr_reqs || [];

    if (!currentFriendOutgoing.includes(id)) {
        console.log('Friend request does not exist');
        return;
    }

    const { error: updateFriendError } = await supabase
        .from('users')
        .update({
            outgoing_fr_reqs: currentFriendOutgoing.filter((friend: any) => friend !== id),
        })
        .eq('id', friend_id);

    if (updateFriendError) throw updateFriendError;
}

//remove friend
export const removeFriend = async (id: any, friend_id: any) => {

    // Update current user's friends list

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('friends_id')
        .eq('id', id);

    if (userError) throw userError;

    const currentFriends = userData[0].friends_id || [];

    if (!currentFriends.includes(friend_id)) {
        console.log('Friend does not exist');
        return;
    }

    const { error: removeError } = await supabase
        .from('users')
        .update({
            friends_id: currentFriends.filter((friend: any) => friend !== friend_id),
        })
        .eq('id', id);

    if (removeError) throw removeError;

    // Update friend's friends list

    const { data: friendData, error: friendError } = await supabase
        .from('users')
        .select('friends_id')
        .eq('id', friend_id);

    if (friendError) throw friendError;

    const currentFriendFriends = friendData[0].friends_id || [];

    if (!currentFriendFriends.includes(id)) {
        console.log('Friend does not exist');
        return;
    }

    const { error: updateFriendError } = await supabase
        .from('users')
        .update({
            friends_id: currentFriendFriends.filter((friend: any) => friend !== id),
        })
        .eq('id', friend_id);

    if (updateFriendError) throw updateFriendError;
}

export const searchFriends = async (search: string) => {
    const { data, error } = await supabase.from('users').select().textSearch('name_email', `${search}`)
    if (error) throw error
    return data
}
