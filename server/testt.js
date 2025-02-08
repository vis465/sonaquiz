

app.post('/sample', async (req, res) => {
  try {

    const data = await client.get('sample');

    if (data) {
      console.log('Cache hit: Returning data from Redis.');
      return res.send(data);  
    }

    
    const freshData = await axios.get("https://jsonplaceholder.typicode.com/photos");
    await client.setEx('sample', 1000, JSON.stringify(freshData.data));  
    res.json(freshData.data);  
  } catch (error) {
    console.error('Error during Redis operation:', error);
    res.status(500).send('Something went wrong!');
  }
});


app.listen(3000, () => console.log('Server is listening on port 3000'));
