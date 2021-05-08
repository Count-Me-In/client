import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import classes from './DaysCheckBox.module.css'

const mapIndexToDayString = ((index) => {
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]
    return DAYS[index];
})

export default function CheckboxesGroup({ restrictions, updateUserRestrictions }) {
    const handleChange = (event) => {
        console.log("inside handle change day check box")
        const newRestrictions = [...restrictions];
        newRestrictions[event.target.name] = event.target.checked;
        updateUserRestrictions(newRestrictions);
    };

    return (
        <div>
            <FormControl component="fieldset">
                <FormLabel component="legend">Pick days for your worker</FormLabel>
                <FormGroup>
                    {restrictions.map((canCome, i) => 
                        (<FormControlLabel control={<Checkbox checked={canCome} onChange={handleChange} name={i} />} label={mapIndexToDayString(i)}/>))}
                </FormGroup>
            </FormControl>
        </div>
    );
}