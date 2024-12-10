import { useEffect, useRef } from 'react';
import { Player } from '@lordicon/react';

import DocIcon from './lordicons/wired-document.json';
import ArrowsIcon from './lordicons/compare-pinch.json';
import ColumnsIcon from './lordicons/columns.json';
import RulesIcon from './lordicons/rules-in-reveal.json';


export function AnimatedIcon({ iconType, size = 160 }: { iconType: 'doc' | 'arrows' | 'columns' | 'rules', size?: number }) {    
    const playerRef = useRef<Player>(null);
  
    useEffect(() => {
        playerRef.current?.playFromBeginning();
    }, [])

    const icons = {
        doc: DocIcon,
        arrows: ArrowsIcon,
        columns: ColumnsIcon,
        rules: RulesIcon
    };
    const icon = icons[iconType];

    return (
        <Player 
            ref={playerRef} 
            size={size}
            icon={icon}
            onComplete={() => {
                setTimeout(() => {
                    playerRef.current?.playFromBeginning();
                }, iconType === "arrows" ? 2500 : 1500)}
            }
            colors="primary:#004751,secondary:#0AEF8D"
        />
    );
}