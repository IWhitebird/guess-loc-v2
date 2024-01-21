import supabase from './init'

export const findUser = async (id: any) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
    if (error) throw error
    return data
}

export const updateScore = async (id: any, score: any) => {
    const { data, error } = await supabase
        .from('users')
        .update({ user_maxscore: score })
        .eq('id', id)
    if (error) throw error
    return data
}

export const getFriends = async (id: any) => {
    const { data, error } = await supabase
        .from('users')
        .select('friends_id')
        .eq('id', id)

    let friendsList: any = []

    if (data) {
        for (const friends of data) {
            for (const friend of friends.friends_id) {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', friend)
                    .single()
                if (error) throw error
                friendsList.push(data)
            }
        }
    }

    if (error) throw error
    return friendsList
}