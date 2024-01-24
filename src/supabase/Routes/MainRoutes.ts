import supabase from '../init'

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

//set online status
export const setOnline = async (id: any, status: string) => {
    console.log(status, id)
    const { data, error } = await supabase
        .from('users')
        // @ts-ignore
        .update({ online_status: status })
        .eq('id', id)

    if (error) throw error
    return data
}