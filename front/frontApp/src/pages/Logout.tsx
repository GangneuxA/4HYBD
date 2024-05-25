import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React from 'react';
import {logOutOutline} from 'ionicons/icons'
import { Preferences } from '@capacitor/preferences';
import { global } from "../Global";

const Logout: React.FC = () => {

    const router = useIonRouter();

    const Logout = async () => {
            await Preferences.remove({ key: 'token'})
            await Preferences.remove({ key: 'id'})
            router.push('/', 'forward')
    }

    return (
        <IonButtons slot='end'>
            <IonButton onClick={Logout}>
                <IonIcon slot='icon-only' icon={logOutOutline}></IonIcon>
            </IonButton>
        </IonButtons>
    );
};

export default Logout;