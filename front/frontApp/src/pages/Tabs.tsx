import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import Messages from './Messages';
import { Redirect, Route } from 'react-router-dom';
import Profile from './Profile';
import { atCircleOutline, ellipse, phonePortrait, triangle } from 'ionicons/icons';
import Storie from './Storie';
import Photo from './Photo';

const Tabs: React.FC = () => {

    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route path='/app/messages' component={Messages} />
                <Route path='/app/profile' component={Profile} />
                <Route path='/app/storie' component={Storie} />
                <Route path='/app/photo' component={Photo} />
                <Route exact path='/app'>
                    <Redirect to='/app/messages'/>
                </Route>
            </IonRouterOutlet>

            <IonTabBar slot='bottom'>
                <IonTabButton tab='messages' href='/app/messages'>
                    <IonIcon icon={triangle}/>
                    <IonLabel>Messages</IonLabel>
                </IonTabButton>
                <IonTabButton tab='profile' href='/app/profile'>
                    <IonIcon icon={ellipse}/>
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>
                <IonTabButton tab='storie' href='/app/storie'>
                    <IonIcon icon={atCircleOutline}/>
                    <IonLabel>Storie</IonLabel>
                </IonTabButton>
                <IonTabButton tab='photo' href='/app/photo'>
                    <IonIcon icon={phonePortrait}/>
                    <IonLabel>Photo</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

export default Tabs;