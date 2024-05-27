import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { checkboxOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import {global} from "../Global";

const HEADERS = {
    'Content-Type': 'application/json',
    'accept': 'application/json'
}

const Register: React.FC = () => {

    const router = useIonRouter();

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[pseudo, setPseudo] = useState('');

    const doRegister = async (event: any) => {
        event.preventDefault()
        
        try {
            const response = await fetch(`${global.URL_BACK}users`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({ email, password, pseudo }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            router.goBack()
        } catch (error) {
            console.error('Error during register:', error)
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/'/>
                    </IonButtons>
                    <IonTitle>Register</IonTitle>
                </IonToolbar>  
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardContent>
                            <IonInput 
                                fill="outline" 
                                labelPlacement="floating" 
                                label="Pseudo" 
                                type='text' 
                                placeholder='superPseudoCool'
                                value={pseudo}
                                onIonChange={(e: any) => setPseudo(e.detail.value)}
                            />
                            <IonInput 
                                className='ion-margin-top' 
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
                            <IonButton color={'primary'} onClick={doRegister} expand='block' className='ion-margin-top'>
                                Register
                                <IonIcon icon={checkboxOutline} slot='end'></IonIcon>
                            </IonButton>
                    </IonCardContent>
                </IonCard>
            </IonContent>

        </IonPage>
    );
};

export default Register;