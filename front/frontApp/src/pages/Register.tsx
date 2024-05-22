import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { checkboxOutline } from 'ionicons/icons';
import React from 'react';

const Register: React.FC = () => {

    const router = useIonRouter();

    const doRegister = (event: any) => {
        event.preventDefault()
        console.log('doRegister')
        router.goBack()
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
                        <form onSubmit={doRegister}>
                            <IonInput fill="outline" labelPlacement="floating" label="Pseudo" type='text' placeholder='superPseudoCool'></IonInput>
                            <IonInput className='ion-margin-top' fill="outline" labelPlacement="floating" label="Email" type='email' placeholder='example@example.fr'></IonInput>
                            <IonInput className='ion-margin-top' fill="outline" labelPlacement="floating" label="Password" type='password' placeholder='password'></IonInput>
                            <IonButton routerLink='register' color={'primary'} type='submit' expand='block' className='ion-margin-top'>
                                Register
                                <IonIcon icon={checkboxOutline} slot='end'></IonIcon>
                            </IonButton>
                        </form>
                    </IonCardContent>
                </IonCard>
            </IonContent>

        </IonPage>
    );
};

export default Register;