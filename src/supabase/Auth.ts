import { Provider } from '@supabase/supabase-js';
import supabase from './init'

export async function CheckUser() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            return true && user;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function EmailLogin(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (data?.user?.aud === 'authenticated') {
            return true;
        }

        if (error) {
            return false;
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
        } else {
            return true;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function EmailSignUpNewUser(email: string, password: string, name: string) {
    try {
        const { data: existingUsers, error: getUsersError } = await supabase
            .from('users')
            .select('id')
            .eq('user_email', email);

        if (getUsersError) {
            console.error(getUsersError);
            throw getUsersError;
        }

        if (existingUsers && existingUsers.length > 0) {
            console.error('Email already exists');
            return false;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                },
                emailRedirectTo: import.meta.env.VITE_MODE === 'dev' ? 'http://localhost:5173/verify' : 'https://guess-loc-v2.vercel.app/verify',
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
        const { error } = await supabase.auth.signInWithOAuth(
            {
                provider,
                options: {
                    redirectTo: import.meta.env.VITE_MODE === 'dev' ? 'http://localhost:5173/verify' : 'https://guess-loc-v2.vercel.app/verify',
                    // redirectTo: 'https://guess-loc-v2.vercel.app/verify',
                }
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