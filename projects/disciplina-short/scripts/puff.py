import numpy as np, wave
SR=44100; n=np.arange(int(SR*0.35))/SR
x=np.random.default_rng(3).standard_normal(len(n)); x=np.convolve(x,np.ones(30)/30,mode='same')
x=x*np.minimum(1,n/0.004)*np.exp(-n/0.07); x+=0.6*np.sin(2*np.pi*(120*np.exp(-n*8)+50)*n)*np.exp(-n/0.06)
x=x/np.abs(x).max()*0.75; st=np.stack([x,x],1)
w=wave.open('/home/user/claude-code-video-toolkit/projects/disciplina-short/public/sfx/puff.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
