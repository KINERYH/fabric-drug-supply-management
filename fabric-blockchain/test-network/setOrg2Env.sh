# Environment variables for Org2

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

# output the variables that need to be set
echo "CORE_PEER_TLS_ENABLED=${CORE_PEER_TLS_ENABLED}"
echo "CORE_PEER_LOCALMSPID=${CORE_PEER_LOCALMSPID}"
echo "CORE_PEER_TLS_ROOTCERT_FILE=${CORE_PEER_TLS_ROOTCERT_FILE}"
echo "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH}"
echo "CORE_PEER_ADDRESS=${CORE_PEER_ADDRESS}"