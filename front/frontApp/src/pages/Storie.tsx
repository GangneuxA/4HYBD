import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonPage, IonRefresher, IonRefresherContent, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Logout from "./Logout"
import { Preferences } from '@capacitor/preferences';
import { global } from "../Global";
import { Camera, CameraResultType } from '@capacitor/camera';
import Pica from 'pica'
import { Geolocation } from '@capacitor/geolocation';
import { trashBin } from 'ionicons/icons';

const Storie: React.FC = () => {

    const [image, setImage] = useState<any>(null)
    const [geo, setGeo] = useState<any>(null)
    const [stories, setStories] = useState<any[]>([])
    const [id, setID] = useState<any>(null)
    const [imagetmp, setImageTmp] = useState<any>(null)
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [conv, setConv] = useState<any[]>([])

    console.log(Preferences.get({ key: 'id'}))

    const printCurrentPosition = async () => {
        const coordinates = await Geolocation.getCurrentPosition();
        const latitude = coordinates.coords.latitude
        const longitude = coordinates.coords.longitude
        setGeo(`Lat:${latitude}:Lon:${longitude}`)
        setUserLocation({ lat: latitude, lon: longitude });
    };
 
    const takePicture = async () => {
        try {
            const pic = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Base64,
            });

            printCurrentPosition()

            if (pic.base64String) {
                
                const imgtmp = `data:image/jpeg;base64,${pic.base64String}`;
                setImageTmp(imgtmp);
        
                
                const byteString = atob(pic.base64String);
                const mimeString = 'image/jpeg';
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const originalBlob = new Blob([ab], { type: mimeString });
        
                const img = new Image();
                img.src = URL.createObjectURL(originalBlob);
        
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 500;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
        
                    const pica = Pica();
                    const resizedCanvas = await pica.resize(img, canvas, {
                        quality: 3,
                    });
        
                    const resizedBlob = await pica.toBlob(resizedCanvas, 'image/jpeg', 0.90);
                    setImage(resizedBlob);
                };
            } else {
                console.error('Base64 string is undefined');
            }
        } catch (error) {
            console.error('Error taking picture:', error);
        }
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
            setStories(data)
            const { value: id } = await Preferences.get({ key: 'id' })
            setID(id)
            
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    }

    const sendStorie = async () => {
        try {

            console.log(image)

            const formData = new FormData();

            if(geo) {
                formData.append('location', geo)
            }
            if (image) {
                formData.append('image', image , 'photo.jpg');
            }

            console.log(formData.get('image'))
            
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}stories`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            console.log(response)

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            getStories()
            
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    };

    const Deletestorie = async (storieid: number) => {
        try {
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}stories/${storieid}`, {
                method: 'DELETE',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            
            getStories()
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            0.5 - Math.cos(dLat)/2 + 
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            (1 - Math.cos(dLon))/2;

        return R * 2 * Math.asin(Math.sqrt(a));
    }

    const GetAllConv = async () => {
        try {
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}conversation`, {
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
            setConv(data)
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    };

    const sendmessage = async (friendid: any) => {
        try {

            const formData = new FormData();

            formData.append('receiver', friendid);
            if (image) {
                formData.append('image', image, 'photo.jpg');
            }
            const { value: token } = await Preferences.get({ key: 'token' });
            const response = await fetch(`${global.URL_BACK}message`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            
        } catch (error) {
            console.error('Error during fetch:', error)
        }
    };

    const sendFriends = async () => {
        for (const friendid of conv ) {
            await sendmessage(friendid)
        }
    };

    const ImageDecoder = ( imageBase64: string ) => {
      
        const img = `data:image/jpeg;base64,${imageBase64}`
      
        return (
            <img src={img} alt="Image décoder" />
        );
      };

    useEffect(() => {
        getStories()
        printCurrentPosition()
        GetAllConv()
    }, []);

    const doRefresh = async (event:any) => {
        await getStories()
        await GetAllConv()
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
                <IonButton expand='full' onClick={takePicture}>Take Picture</IonButton>
                {imagetmp && 
                    <IonCard>
                        <IonImg src={imagetmp} className="fixed-size-img" alt="Photo"/>
                        <IonButton onClick={sendStorie}>Public Storie</IonButton>
                        <IonButton onClick={sendFriends}>Send to friends</IonButton>
                    </IonCard> 
                }
                <IonCard>
                    <IonHeader>My Storie</IonHeader>
                    <IonCardContent>
                        {stories.filter(storie => storie.user_id == id).map((storie, index) => (
                            <IonItem key={index}>
                                <IonLabel>
                                    {ImageDecoder(storie.image)}
                                </IonLabel>
                                <IonButton onClick={() => Deletestorie(storie.id)} color='danger'>
                                    <IonIcon slot='icon-only' icon={trashBin}></IonIcon>
                                </IonButton>
                            </IonItem>
                        ))}
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonHeader>Storie near to me</IonHeader>
                    <IonCardContent>
                        {stories.filter(storie => {
                            if (storie.user_id != id && userLocation && storie.location) {
                                const storieLat = storie.location.split(':')[1]
                                const storieLon = storie.location.split(':')[3]
                                const distance = calculateDistance(userLocation.lat, userLocation.lon, storieLat, storieLon);
                                return distance <= 10; 
                            }
                            return false;
                        }).map((storie, index) => (
                            <IonItem key={index}>
                                <IonLabel>
                                    {ImageDecoder(storie.image)}
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Storie;