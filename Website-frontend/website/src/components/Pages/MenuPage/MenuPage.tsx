import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { API_URL } from '../../../utils';
import logoImage from '../../../migdal_or.png';
import '../../../themes.css';

export interface MenuPageProps {
    changePage(newPage: number): void;
}
export const MenuPage: React.FC<MenuPageProps> = ({
    changePage,
}) => {

    const [tableValues, setTableValues] = React.useState<Array<Array<number>>>([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ]);
    
    const [errorCells, setErrorCells] = React.useState<Array<Array<boolean>>>([
        [false, false, false, false, false],
        [false, false, false, false, false],
    ]);

    const [errorHours, setErrorHours] = React.useState<boolean>(false);
    const [errorGain3, setErrorGain3] = React.useState<boolean>(false);
    const [errorGain4, setErrorGain4] = React.useState<boolean>(false);

    const [hours, setHours] = React.useState<number>(0);
    const [gain3, setGain3] = React.useState<number>(0);
    const [gain4, setGain4] = React.useState<number>(0);
    const [error, setError] = React.useState<String>("");
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const is_error = () => {
        return errorCells[0].includes(true) || errorCells[1].includes(true) || errorHours || errorGain3 || errorGain4 || selectedFile == null;
    }

    const handleValueChange = (rowIndex: number, colIndex: number, value: String) => {
        console.log(tableValues[rowIndex][colIndex]);
        if (!isNaN(Number(value)) && value !== "") {
            // Create a copy of the current tableValues array
            const updatedTableValues = [...tableValues];
            // Update the value at the specified row and column index
            updatedTableValues[rowIndex][colIndex] = Number(value);
            // Update the state with the new tableValues
            setTableValues(updatedTableValues);
            const updatedErrorCells = [...errorCells];
            updatedErrorCells[rowIndex][colIndex] = false;
            setErrorCells(updatedErrorCells);
        }
        else {
            const updatedErrorCells = [...errorCells];
            updatedErrorCells[rowIndex][colIndex] = true;
            setErrorCells(updatedErrorCells);
        }
    };

    const handleHoursChange = (value: String) => {
        if (!isNaN(Number(value)) && value !== "") {
            setHours(Number(value));
            setErrorHours(false);
        }
        else {
            setErrorHours(true);
        }
    };

    const handleGain3Change = (value: String) => {
        if (!isNaN(Number(value)) && value !== "") {
            setGain3(Number(value));
            setErrorGain3(false);
        }
        else {
            setErrorGain3(true);
        }
    };

    const handleGain4Change = (value: String) => {
        if (!isNaN(Number(value)) && value !== "") {
            setGain4(Number(value));
            setErrorGain4(false);
        }
        else {
            setErrorGain4(true);
        }
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        axios.defaults.withCredentials = true;
        const formData = new FormData();
        formData.append('file', selectedFile ? selectedFile : "");
        formData.append('hours', hours.toString());
        formData.append('gain3', gain3.toString());
        formData.append('gain4', gain4.toString());
        formData.append('tableValues', JSON.stringify(tableValues));
        console.log(formData);
        await axios.post(`${API_URL}/api/calculate`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(res => {
                if (res.status === 200) {
                    global.placements = res.data;
                    changePage(1);
                }
            })
            .catch(err => {
                console.log(err);
                if (err.response.status === 400) {
                    try {
                        setError(err.response.data.message);
                    }
                    catch (err) {
                        setError("שגיאה לא ידועה");
                    }
                }
            })
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Table style={{ width: '70%', marginTop: '30px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    ברגים
                                </Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    בדיקת מים
                                </Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    בוכנה
                                </Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    ידית ישר
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[1, 2].map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {[1, 2, 3, 4, 5].map((col, colIndex) => (
                                    <TableCell key={colIndex}>
                                        {colIndex === 4 && rowIndex === 0 ? (
                                            <b>כמות יחידות נדרשת</b>) :
                                            colIndex === 4 && rowIndex === 1 ? (
                                                <b>כמות יחידות במלאי</b>) :
                                                (
                                                    <TextField defaultValue="0" variant="outlined"
                                                        inputProps={{ style: { textAlign: 'center' } }}
                                                        error={errorCells[rowIndex][colIndex]}
                                                        helperText={errorCells[rowIndex][colIndex] ? 'הכנס מספר' : ''}
                                                        onChange={(e) =>
                                                            handleValueChange(rowIndex, colIndex, e.target.value)} />
                                                )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '70px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto', gap: '20px', marginRight: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField defaultValue="0" variant="outlined" style={{ marginRight: '20px' }} inputProps={{ style: { textAlign: 'center' } }}
                            error={errorGain3}
                            helperText={errorGain3 ? 'הכנס מספר' : ''}
                            onChange={(e) => { handleGain3Change(e.target.value) }} />
                        <Typography variant="subtitle1" style={{ marginRight: '20px', textAlign: 'right' }}>
                            <b>:רווח כספי עבור ברגים</b>
                        </Typography>
                        <TextField defaultValue="0" variant="outlined" style={{ marginRight: '20px' }} inputProps={{ style: { textAlign: 'center' } }}
                            error={errorGain4}
                            helperText={errorGain4 ? 'הכנס מספר' : ''}
                            onChange={(e) => { handleGain4Change(e.target.value) }} />
                        <Typography variant="subtitle1" style={{ marginRight: '20px', textAlign: 'right' }}>
                            <b>:רווח כספי עבור שלוקר</b>
                        </Typography>
                        <TextField defaultValue="8" variant="outlined" style={{ marginRight: '20px' }} inputProps={{ style: { textAlign: 'center' } }}
                            error={errorHours}
                            helperText={errorHours ? 'הכנס מספר' : ''}
                            onChange={(e) => { handleHoursChange(e.target.value) }} />
                        <Typography variant="subtitle1" style={{ marginRight: '20px', textAlign: 'right' }}>
                            <b>:הכנס מספר שעות עבודה</b>
                        </Typography>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'max-content auto', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Button variant="contained" component="label" style={{color: 'rgb(255, 215, 0)', backgroundColor: 'rgb(0, 102, 51)', fontWeight: "bold" }}>
                            {selectedFile ? selectedFile.name : 'העלאת קובץ'}
                            <input type="file" style={{ display: 'none' }}
                                accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleFileChange} />
                        </Button>
                        <Typography variant="subtitle1" style={{ marginRight: '20px', marginLeft: '24px', textAlign: 'right' }}>
                            <b>:הכנסת קובץ אקסל</b>
                        </Typography>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <Button variant="contained" size="large"
                    style={{ fontSize: '1.5rem', padding: '16px 32px', minWidth: '240px', color: 'rgb(255, 215, 0)', backgroundColor: 'rgb(0, 102, 51)' }}
                    disabled={is_error()}
                    classes={{ disabled: "disabled-button" }}
                    onClick={handleSubmit}>
                <b>קבלת תוצאות הושבה</b>               
                </Button>
                {error ? <Typography variant="subtitle1">
                    {error}
                </Typography> : null}
            </div>
            <div style={{ position: 'fixed', bottom: '0px', left: '40px' }}>
                <img
                    src={logoImage}
                    alt="Logo"
                    style={{ width: '254px', height: '200px' }}
                />
            </div>
        </div>
    );
}
