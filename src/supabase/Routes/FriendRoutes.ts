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

    const cur_list = await supabase
        .from('users')
        .select('friends_id')
        .eq('id', id);

    
        if (cur_list.error){
        throw cur_list.error
    }

    const currentFriends = cur_list.data[0].friends_id ? cur_list.data[0].friends_id : [];

    if (currentFriends.includes(friend_id)) {
        console.log('Friend already exists');
        return;
    }

    await supabase
        .from('users')
        .update({
            friends_id: [...currentFriends, friend_id],
            incoming_fr_reqs: null,
            outgoing_fr_reqs: null,
        })
        .eq('id', id);


    // Update friend's friends list

    const cur_fr_list = await supabase
        .from('users')
        .select('friends_id')
        .eq('id', friend_id);

    if (cur_fr_list.error) {
        throw cur_fr_list.error;
    } 

    const currentFriendFriends = cur_fr_list.data[0].friends_id ? cur_fr_list.data[0].friends_id : [];

    if (currentFriendFriends.includes(id)) {
        console.log('Friend already exists');
        return;
    }

    await supabase
        .from('users')
        .update({
            friends_id: [...currentFriendFriends, id],
            outgoing_fr_reqs: null,
            incoming_fr_reqs: null,
        })
        .eq('id', friend_id);

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

export const searchFriends = async (search: string) => {
    const { data, error } = await supabase.from('users').select().textSearch('name_email', `${search}`)
    if (error) throw error
    return data
}

export const getFriendRequests = async (id: any) => {
    const { data, error } = await supabase
        .from('users')
        .select('incoming_fr_reqs')
        .eq('id', id)
        .single()

    let friendRequests: any = []

    if (data?.incoming_fr_reqs && data?.incoming_fr_reqs.length > 0) {
        for (let i = 0; i < data?.incoming_fr_reqs.length; i++) {
            const { data: friendData, error: friendError } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.incoming_fr_reqs[i])
                .single()
            if (friendError) throw friendError
            friendRequests.push(friendData)
        }
    }

    if (error) throw error
    return friendRequests
}
