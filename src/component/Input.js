import React from 'react';
import PropTypes from 'prop-types';

export default function Input(props) {
    const { label, errorMessage, ...rest } = props;

    return (
        <>
            <div className='form-group'>
                {
                    label ? <h5>{label}</h5> : null
                }
                <input {...rest} className='form-control' />
            </div>

            {
                errorMessage ? <h5 className='text-danger'>{errorMessage}</h5> : null
            }
        </>
    )
}

Input.propTypes = {
    label: PropTypes.string,
    errorMessage: PropTypes.string
};