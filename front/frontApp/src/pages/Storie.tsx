import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import Logout from "./Logout"
import { Preferences } from '@capacitor/preferences';
import { global } from "../Global";

const Storie: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='primary'>
                    <IonTitle>Photo</IonTitle>
                    <Logout/>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">

            </IonContent>
        </IonPage>
    );
};

export default Storie;