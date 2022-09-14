function [S]=open_bspline(P, t)

M1 = 1/2*[ 2 -4 2; -3 4 0; 1 0 0];
M2 = 1/2*[ 1 -2 1; -2 2 1; 1 0 0];
M3 = 1/2*[ 1 -2 1; -3 2 1; 2 0 0];
T = [t.^2; t; t.^0];

n = size(P, 2);
B = P(:, 1:3)*M1*T;
S = B;

for i = 2 : n -3
    B = P(:, i:i+2)*M2*T;
    S = [S B];
end

B = P(:, n-2:n)*M3*T;
S = [S B];

endfunction

P = [
    1, 2;
    6, 7;
    3, 8;
    10, 11;
    4, 7;
    8, 4;
    9, 36;
    4, 1
]
a=rand(3,3);p=poly([1,2,3],'s');l=list(1,'asdf',[1 2 3]);
print(%io(2),a,p,l)


//print(%io(2), P)
//plot()
//t = 0.5;
//S = open_bspline(P, t);
//plot(S)
