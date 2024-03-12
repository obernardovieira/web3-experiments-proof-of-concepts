import React from 'react';
import AddNewVerification from './AddNewVerification';
import ClaimVerification from './ClaimVerification';

interface Props {
    // Define your component's props here
}

const Verifications: React.FC<Props> = () => {

    return (
        <div>
            <AddNewVerification />
            <ClaimVerification />
        </div>
    );
};

export default Verifications;