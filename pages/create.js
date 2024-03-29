import { useRef, useState, useContext} from 'react';
import { DirectoriesContext } from '../components/context/directoriesContext';
import { UserContext } from '../components/context/userContext';
import { Text, Col, Row, Input, Spacer, Button } from '@nextui-org/react';
import Layout from '../components/Layout';
import DocumentsList from '../components/DocumentsList';
import { Dropdown, FilePicker, ListLoader } from '../components/UI';
import Directory from '../libs/directory';
import store from '../libs/store';
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { IoIosAlbums } from 'react-icons/io';
import convertFiles from '../libs/util/convertFiles';

export default function Create () {

    const { 
        directories, 
        directoriesList, 
        handleSetState, 
        handleSaveDirectory,
        setLoadingDirectories 
    } = useContext(DirectoriesContext);
    const { user } = useContext(UserContext);

    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [uploadingDocuments, setUploadingDocuments] = useState(false);
    
    const [files, setFiles] = useState([]);

    let directoryNameRef = useRef();

    const handleResetSelectedDocuments = () => {
        setSelectedDocuments([]);
        handleSetDirectoryName("");
    };

    const handleGetFiles = async (event) => {
        let { files } = event.target;
        files = [...files];
        convertFiles(files).then((processedFiles) => {
            console.log('converted files', processedFiles);
            let directory = new Directory();
            directory.setDocuments(processedFiles);
            setFiles(processedFiles);
            setSelectedDocuments(directory.getFormattedDocuments());
            directory = null;
        });
    }

    const handleSetDirectoryName = (text) => {
        directoryNameRef.current.focus();
        directoryNameRef.current.value = text;
    }

    const handleDownloadLegajo = async () => {
        const zip = new JSZip();
        const documentsBuffers = directories.map(async (directory, dirIndex) => {
            const fetchDocuments = directory.documents.map(async (document, docIndex) => {
                const response = await fetch(document.url);
                const arrayBuffer = await response.arrayBuffer();
                let docName = `${dirIndex + 1}. ${directory.name}${docIndex > 0 ? `_${docIndex + 1}` : ""}.pdf`
                zip.file(docName, arrayBuffer, {
                    compression: "DEFLATE",
                    compressionOptions: {
                        level: 5,
                    }
                });
            });

            await Promise.all(fetchDocuments);
        });

        await Promise.all(documentsBuffers);

        const blob = await zip.generateAsync({ type:"blob" })
        saveAs(blob, `Mi Legajuu! - ${user.displayName}`);
        
    }

    const deleteDoc = {

        fromDirectory: (document) => {
            store.removeFromDirectory(document).finally(async () => {
                handleSetState();
            });
            
        },
        
        fromUpload: (document) => {

            const modifiedDocuments = selectedDocuments.filter((uploadDoc) => {

                const documentToDelete = JSON.stringify(document);
                const actualUploadDoc = JSON.stringify(uploadDoc);
                return documentToDelete !== actualUploadDoc;

            });

            setSelectedDocuments(modifiedDocuments);

        },
        
    }

    return (
        <Layout headTitle="Edita tu Legajo">
            <Row>
                <Col>
                    <Row>
                        <Text h1>Crea tu Legajo</Text>
                    </Row>
                    <Row>
                        <FilePicker 
                            accept="application/pdf" 
                            title={"Sube los documentos"} 
                            multiple 
                            onChange={handleGetFiles} 
                            />
                    </Row>
                    <Spacer y={2} />
                    <Row>
                        <Dropdown 
                            title="Selecciona un directorio" 
                            items={directoriesList} 
                            onChange={handleSetDirectoryName} 
                            />
                        <Spacer x={1} />
                        <Input 
                            placeholder="o crea uno nuevo" 
                            ref={directoryNameRef} 
                            />
                        <Spacer x={1} />
                        {
                            selectedDocuments.length > 0 &&
                                <Button 
                                    color="success" 
                                    onPress={() => {
                                        setUploadingDocuments(true);
                                        handleSaveDirectory(files, directoryNameRef.current.value)
                                        .then(() => {
                                            directoryNameRef.current.value = "";
                                            handleResetSelectedDocuments();
                                            setUploadingDocuments(false);
                                        })
                                    }}
                                    >
                                    Guardar Directorio
                                </Button>
                        }
                    </Row>
                    {
                        uploadingDocuments ? <ListLoader /> :
                        (
                            <DocumentsList 
                                isLegajoList
                                documents={ selectedDocuments } 
                                defaultShowPreview 
                                deleteAction={deleteDoc.fromUpload} 
                                />
                        )
                    }
                    <Spacer y={2} />
                    {
                        selectedDocuments.length > 0 && (
                            <Button 
                                color="success" 
                                disabled={ selectedDocuments.length < 1} 
                                onPress={handleSaveDirectory}>
                                Guardar Directorio
                            </Button>
                            )
                    }
                    <Spacer y={2} />
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        directories.map((directory) => {
                            return (
                                <Row key={JSON.stringify(directory)}>
                                    <Col>
                                        <Text h3>{directory.name}</Text>
                                        <DocumentsList 
                                            isLegajoList
                                            documents={directory.documents} 
                                            deleteAction={deleteDoc.fromDirectory} 
                                            isUploadedDirectories
                                            utilityCard={{
                                                onPress: async () => {
                                                    if (directory.documents.length < 2) {
                                                        return false;
                                                    }
                                                    setLoadingDirectories(true);
                                                    directory.joinDirectory().finally(() => {
                                                        setLoadingDirectories(false);
                                                        handleSetState();
                                                    });
                                                },
                                                children:   <>
                                                                <IoIosAlbums size={24} color="gray" />
                                                                <Text b >Unir Documentos</Text>
                                                            </>
                                            }}
                                            />
                                    </Col>
                                </Row>
                            )
                        })
                    }
                    {
                        directories.length < 1 && (
                            <Text b size={24} color="gray">
                                ¿Aún no has creado tu legajo? Sube un documento y selecciona o crea un directorio para empezar.
                            </Text>
                        )
                    }
                </Col>
            </Row>
            {
                (directories.length > 0) 
                    && 
                        <>
                            <Button color="primary" onPress={handleDownloadLegajo} >Descargar Legajo</Button>
                            <Spacer y={2} />
                        </>
            }
        </Layout>
    )
}