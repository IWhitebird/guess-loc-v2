import supabase  from '../init'

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

export const cancelFriendRequest = async (id: any, friend_id: any) => {

    // Update current user's outgoing friend requests

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('outgoing_fr_reqs')
        .eq('id', id);

    if (userError) throw userError;

    const currentOutgoing = userData[0].outgoing_fr_reqs || [];

    if (!currentOutgoing.includes(friend_id)) {
        console.log('Friend request does not exist');
        return;
    }

    const { error: sendError } = await supabase
        .from('users')
        .update({
            outgoing_fr_reqs: currentOutgoing.filter((friend: any) => friend !== friend_id),
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

    if (!currentIncoming.includes(id)) {
        console.log('Friend request does not exist');
        return;
    }

    const { error: updateFriendError } = await supabase
        .from('users')
        .update({
            incoming_fr_reqs: currentIncoming.filter((friend: any) => friend !== id),
        })
        .eq('id', friend_id);

    if (updateFriendError) throw updateFriendError;
}

export const acceptFriendRequest = async (id: any, friend_id: any) => {

    // Update current user's friends list

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('friends_id')
        .eq('id', id);

    if (userError) throw userError;

    const currentFriends = userData[0].friends_id || [];

    if (currentFriends.includes(friend_id)) {
        console.log('Friend already exists');
        return;
    }

    const { error: acceptError } = await supabase
        .from('users')
        .update({
            friends_id: [...currentFriends, friend_id],
            incoming_fr_reqs: null,
            outgoing_fr_reqs: null,
        })
        .eq('id', id);

    if (acceptError) throw acceptError;

    // Update friend's friends list

    const { data: friendData, error: friendError } = await supabase
        .from('users')
        .select('friends_id')
        .eq('id', friend_id);

    if (friendError) throw friendError;

    const currentFriendFriends = friendData[0].friends_id || [];

    if (currentFriendFriends.includes(id)) {
        console.log('Friend already exists');
        return;
    }

    const { error: updateFriendError } = await supabase
        .from('users')
        .update({
            friends_id: [...currentFriendFriends, id],
            outgoing_fr_reqs: null,
            incoming_fr_reqs: null,
        })
        .eq('id', friend_id);

    if (updateFriendError) throw updateFriendError;
}

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