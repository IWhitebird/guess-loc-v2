import supabase from './init'


export async function EmailSignUpNewUser(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'https://localhost:3000/login',
            },
        });

        if (error) {
            console.error(error);
            throw error;
        }
        if (data) {
            const {_ ,error } = await supabase.from('users').insert([{ id: data.user.id, user_email: data.user.email }]);
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}
