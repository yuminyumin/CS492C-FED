/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';

// returns JSX of form (<td></td>)
const PaginationArrow = props => {
    const { currentPagi, setCurrentPage, pagePerPagi, totalPagiCount, symbol, type, enabled } = props;
    if(enabled === false) return (<td hover={type}><p>{symbol}</p></td>);
    
    //const startIndex = currentPagi * pagePerPagi + 1;
    const getGotoPagi = (t) => {
        if(t === 'first') {
            return 1;
        }
        else if(t === 'prev') {
            return currentPagi - 1;
        }
        else if(t === 'next') {
            return currentPagi + 1;
        }
        else if(t === 'last') {
            return totalPagiCount;
        }
        else {
            console.error(`Wrong type: ${type}`);
            return null;
        }
    };
    const gotoPagi = getGotoPagi(type);
    const pageNo = (() => {
        if(type === 'first' || type === 'prev') return gotoPagi * pagePerPagi;
        if(type === 'next' || type === 'last') return (gotoPagi - 1) * pagePerPagi + 1;
        else return null;
    })();

    const clicked = () => {
        setCurrentPage(pageNo);
    };

    if(gotoPagi === null) return (<td type={type}><p>{symbol}</p></td>);
    
    return (
    <td key={pageNo} type={type}>
        <Link to={`/postMain/${pageNo}`} onClick={clicked}>{symbol}</Link>
    </td>
    );
};

export default PaginationArrow;