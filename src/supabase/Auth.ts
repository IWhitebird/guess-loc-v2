import { Provider } from '@supabase/supabase-js';
import supabase from './init'

export async function CheckUser() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase.from('users').upsert([
                { user_id: user.id, user_name: user.user_metadata.user_name, user_email: user.email, user_maxscore: 0 },
            ])
            if (error) {
                console.error(error);
                throw error;
            }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function EmailLogin(email: string, password: string) {
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            console.error(error);
            throw error;
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function EmailLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error);
            throw error;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function EmailSignUpNewUser(email: string, password: string, name: string) {
    try {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    user_name: name
                },
                emailRedirectTo: 'http://localhost:5173/verify',
            },
        });

        if (error) {
            console.error(error);
            throw error;
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function OAuthLogin(provider: Provider) {
    try {
        const { data,error } = await supabase.auth.signInWithOAuth({ provider });

    
        if (error) {
            console.error(error);
            throw error;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
} 