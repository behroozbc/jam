import React, {useMemo} from 'react';
import {render} from 'react-dom';
import {usePath} from './lib/use-location';
import Jam from './Jam';
import Start from './views/Start';
import Me from './views/Me';
import {parseUrlConfig} from './lib/url-utils';
import {importRoomIdentity} from './logic/identity';
import {initializeIdentity} from './logic/backend';

render(<App />, document.querySelector('#root'));

function App() {
  // detect roomId from URL
  const [roomId = null] = usePath();

  const urlData = useMemo(() => {
    let data = parseUrlConfig();
    // console.log('parsed config', JSON.stringify(data));
    if (data.debug) {
      window.DEBUG = true;
    }
    if (roomId === 'me') return data;
    if (roomId !== null && data.identity) {
      importRoomIdentity(roomId, data.identity, data.keys);
      initializeIdentity(roomId);
    }
    return data;
  }, [roomId]);

  switch (roomId) {
    case 'me':
      return <Me />;
    default:
      return (
        <Jam
          style={{height: '100vh'}}
          roomId={roomId}
          newRoom={urlData.room}
          onError={({error}) => {
            return (
              <Start urlRoomId={roomId} roomFromURIError={!!error.createRoom} />
            );
          }}
        />
      );
  }
}
