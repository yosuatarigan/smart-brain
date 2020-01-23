import React from 'react';

const Rank = ({name, entries}) => {
    return (
        <div className='center'>
            <div className='white f3'>
                {`${name} , your current Rank is...`}
         
            <div className='white f1 center'>
                {entries}
            </div>
            </div>
        </div>
    );
}

export default Rank;