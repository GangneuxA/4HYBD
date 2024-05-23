import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { logInOutline, atOutline } from 'ionicons/icons'
import { Preferences } from '@capacitor/preferences';
import {global} from "../Global";

const HEADERS = {
    'Content-Type': 'application/json',
    'accept': 'application/json'
}

const Login: React.FC = () => {

    const router = useIonRouter();

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const doLogin = async (event: any) => {
        
        event.preventDefault()
        
        try {
            const response = await fetch(`${global.URL_BACK}login`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json();
            const token = data.access_token;

            await Preferences.set({
                key: 'token',
                value: token,
            });

            console.log( await Preferences.get({ key:'token' }))
            router.push('/app', 'forward')
        } catch (error) {
            console.error('Error during login:', error)
        }
    }
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardContent>
                        <form onSubmit={doLogin}>
                            <IonInput
                                fill="outline"
                                labelPlacement="floating"
                                label="Email"
                                type='email'
                                placeholder='example@example.fr'
                                value={email}
                                onIonChange={(e: any) => setEmail(e.detail.value)}
                            />
                            <IonInput
                                className='ion-margin-top'
                                fill="outline"
                                labelPlacement="floating"
                                label="Password"
                                type='password'
                                placeholder='password'
                                value={password}
                                onIonChange={(e: any) => setPassword(e.detail.value)}
                            />
                            <IonButton type="submit" expand='block' className='ion-margin-top'>
                                Login
                                <IonIcon icon={logInOutline} slot='end'></IonIcon>
                            </IonButton>
                            <IonButton routerLink='register' color={'secondary'} type='button' expand='block' className='ion-margin-top'>
                                Register
                                <IonIcon icon={atOutline} slot='end'></IonIcon>
                            </IonButton>
                        </form>
                    </IonCardContent>
                </IonCard>
            </IonContent>

        </IonPage>
    );
};

export default Login;