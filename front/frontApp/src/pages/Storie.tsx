import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonPage, IonRefresher, IonRefresherContent, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Logout from "./Logout"
import { Preferences } from '@capacitor/preferences';
import { global } from "../Global";
import { Camera, CameraResultType } from '@capacitor/camera';
import Pica from 'pica'
import { Geolocation } from '@capacitor/geolocation';

const Storie: React.FC = () => {

    const [image, setImage] = useState<any>(null)
    const [geo, setGeo] = useState<any>(null)
    const [stories, setStories] = useState<any[]>([])
    const [id, setID] = useState<any>(null)

    console.log(Preferences.get({ key: 'id'}))

    const printCurrentPosition = async () => {
        const coordinates = await Geolocation.getCurrentPosition();
        console.log(coordinates.coords.latitude)
        const latitude = coordinates.coords.latitude
        const longitude = coordinates.coords.longitude
        setGeo(`Lat:${latitude} : Lon:${longitude}`)
    };
 
    const takePicture = async () => {

            const pic = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Base64,
            });
            printCurrentPosition()
            const img = `data:image/jpeg;base64,${pic.base64String}`
            setImage(img)
            
    };

    const getStories = async () => {
        try {
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}stories`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json();
            console.log(data)
            setStories(data)
            const { value: id } = await Preferences.get({ key: 'id' })
            setID(id)
            console.log(id)
            
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    }

    const ImageDecoder = ( imageBase64: string ) => {
      
        const img = `data:image/jpeg;base64,${imageBase64}`
      
        return (
            <img src={img} alt="Image décoder" />
        );
      };

    useEffect(() => {
        getStories()
    }, []);

    const doRefresh = async (event:any) => {
        await getStories()
        event.detail.complete()
    }



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='primary'>
                    <IonTitle>Storie</IonTitle>
                    <Logout/>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonRefresher slot='fixed' onIonRefresh={doRefresh}>
                    <IonRefresherContent/>
                </IonRefresher>
                <IonButton expand='block' onClick={printCurrentPosition}>Current location</IonButton>
                <IonLabel>{geo}</IonLabel>
                <IonButton expand='full' onClick={takePicture}>Take Picture</IonButton>
                {image && 
                    <IonCard>
                        <IonImg src={image} className="fixed-size-img" alt="Photo"/>
                        <IonButton>Public Storie</IonButton>
                        <IonButton>Send to friends</IonButton>
                    </IonCard> 
                }
                <IonCard>
                    <IonHeader>My Storie</IonHeader>
                    <IonCardContent>
                            {stories.map((storie, index) =>
                                <IonItem key={index}>
                                    {storie.user_id == id && (
                                        <IonLabel>
                                            {ImageDecoder(storie.image)}
                                        </IonLabel>
                                    )}
                                </IonItem>
                            )}
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonHeader>Storie near to me</IonHeader>
                    <IonCardContent>
                        {stories.map((storie, index) =>
                                <IonItem key={index}>
                                    {storie.user_id != id && (
                                        <IonLabel>
                                            {ImageDecoder(storie.image)}
                                        </IonLabel>
                                    )}
                                </IonItem>
                            )}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Storie;