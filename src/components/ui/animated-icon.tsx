import { useEffect, useRef } from 'react';
import { Player } from '@lordicon/react';

import ICON from '../../assets/icons/wired-document.json';

export function AnimatedIcon() {    
  const playerRef = useRef<Player>(null);
  
    useEffect(() => {
        playerRef.current?.playFromBeginning();
    }, [])

    return (
        <Player 
            ref={playerRef} 
            size={150}
            icon={ ICON }
            onComplete={() => setTimeout(() => {
                playerRef.current?.playFromBeginning();
            }, 1500)}
            colors="primary:#004751,secondary:#0AEF8D"
        />
    );
}